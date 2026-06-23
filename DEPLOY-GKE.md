# Deploying the Ticketing App to GKE (Google Kubernetes Engine)

A step-by-step runbook for deploying this microservices app to Google Cloud,
plus the errors we hit and how to fix them.

> **Architecture:** local Docker builds the images → pushes them to **Artifact
> Registry** → **GKE** runs them → **ingress-nginx** gives one public IP that
> routes `/api/...` to each service and `/` to the Next.js client.

---

## 0. Your project's values (used throughout)

| Thing | Value |
|---|---|
| GCP Project ID | `ride-wave-464217` |
| Project number | `274656501375` |
| Region / Zone | `asia-south1` / `asia-south1-a` (Mumbai) |
| Cluster name | `ticketing` |
| Artifact Registry repo | `asia-south1-docker.pkg.dev/ride-wave-464217/ticketing` |
| Node service account | `274656501375-compute@developer.gserviceaccount.com` |
| App URL (ephemeral IP) | `http://<EXTERNAL-IP from step 6>` |

> **PATH note (Windows):** the gcloud tools live at
> `C:\Users\zain9\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin`.
> This must be on PATH or `gcloud`, `docker-credential-gcloud`, and
> `gke-gcloud-auth-plugin` won't be found. Make it permanent once:
> ```powershell
> [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Users\zain9\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin", "User")
> ```
> Then use a **fresh** terminal.

---

## Prerequisites (installed once)

- **Docker Desktop** (builds the images locally)
- **gcloud CLI** — https://cloud.google.com/sdk/docs/install#windows
- **kubectl** (ships with Docker Desktop) + **gke-gcloud-auth-plugin**:
  ```powershell
  gcloud components install gke-gcloud-auth-plugin
  ```
- **skaffold** (already used by this project)

---

## One-time GCP setup (Steps 1–7)

### Step 1 — Log in & pick the project
```powershell
gcloud init                 # browser login, choose account
gcloud config set project ride-wave-464217
gcloud billing projects describe ride-wave-464217   # must show billingEnabled: true
```

### Step 2 — Enable the required APIs
```powershell
gcloud services enable container.googleapis.com artifactregistry.googleapis.com
```

### Step 3 — Create the image repository + Docker auth
```powershell
gcloud artifacts repositories create ticketing --repository-format=docker --location=asia-south1 --description="Ticketing app images"
gcloud auth configure-docker asia-south1-docker.pkg.dev    # answer Y
```

### Step 4 — Create the GKE cluster + connect kubectl
```powershell
gcloud container clusters create ticketing --zone=asia-south1-a --num-nodes=3 --machine-type=e2-medium --disk-size=32
gcloud container clusters get-credentials ticketing --zone=asia-south1-a
kubectl get nodes        # expect 3 Ready nodes
```
> `--disk-size=32` is required: the default 100 GB disks × 3 nodes = 300 GB,
> which exceeds the regional `SSD_TOTAL_GB` quota of 250 GB.

### Step 5 — Let the nodes pull from Artifact Registry
```powershell
gcloud projects add-iam-policy-binding ride-wave-464217 --member="serviceAccount:274656501375-compute@developer.gserviceaccount.com" --role="roles/artifactregistry.reader"
```
Image names are already set in `skaffold.yaml` and `infra/k8s/*-depl.yaml` to
`asia-south1-docker.pkg.dev/ride-wave-464217/ticketing/<svc>` (old Docker Hub
names are kept commented out). `skaffold.yaml` has `build.local.push: true`.

### Step 6 — Install ingress-nginx + get the public IP
```powershell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.15.1/deploy/static/provider/cloud/deploy.yaml
kubectl get service ingress-nginx-controller -n ingress-nginx   # re-run until EXTERNAL-IP is real
```

### Step 6b — Create the secrets
```powershell
# jwt-secret is also in infra/k8s/jwt-secret.yaml, but this is fine too:
kubectl create secret generic jwt-secret --from-literal JWT_KEY=dev_jwt_secret_key_please_change
# stripe-secret is required and NOT in git:
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=<your sk_test_... key>
```

### Step 7 — Config already in the repo
- `client/api/build-client.js` — sends SSR API calls to
  `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local`, browser
  calls go to relative `/`.
- `infra/k8s/ingress-srv.yaml` — has a **host-less catch-all** rule so the app
  is reachable by the raw IP (the `ticket.dev` / `localhost` rules are kept for
  local dev).

---

## Step 8 — Deploy 🚀
```powershell
cd "C:\D drive\Tech\ticket"
kubectl config current-context          # must be gke_ride-wave-464217_asia-south1-a_ticketing
skaffold run --status-check=false
```
`--status-check=false` avoids a false failure from the NATS startup race
(services self-heal via Kubernetes restarts).

## Step 9 — Verify
```powershell
kubectl get pods                                   # all Running
kubectl get ingress                                # ADDRESS = your public IP
```
Open `http://<EXTERNAL-IP>` in a browser, or test:
```powershell
Invoke-WebRequest http://<EXTERNAL-IP>/api/users/currentuser -UseBasicParsing
# -> {"currentUser":null}
```

---

## Redeploying after code changes
```powershell
cd "C:\D drive\Tech\ticket"
skaffold run --status-check=false
```
Only changed services rebuild/push.

## 💰 Teardown (stop the billing!)
The cluster + load balancer cost ~$2–3/day. When done:
```powershell
gcloud container clusters delete ticketing --zone=asia-south1-a
```
To come back later: redo Step 4, Step 5, Step 6, Step 8.

---

## Troubleshooting (errors we actually hit)

| Error | Cause | Fix |
|---|---|---|
| `Requested entity already exists` creating a project | Project IDs are globally unique | Use a unique ID, or reuse an existing project |
| `exceeded your allotted project quota` | Too many GCP projects | Reuse an existing project (deleting frees quota only after 30 days) |
| `Quota 'SSD_TOTAL_GB' exceeded. Limit: 250` | 3×100 GB default disks > quota | Add `--disk-size=32` to cluster create |
| `gcloud : not recognized` | SDK bin not on PATH | Open a fresh terminal / add the bin to PATH (see top) |
| `docker-credential-gcloud ... not found in %PATH%` | SDK bin not on PATH for the push | Add the bin to PATH, then `skaffold run` |
| `Unauthenticated request ... uploadArtifacts` | Docker not logged in to Artifact Registry | `gcloud auth configure-docker asia-south1-docker.pkg.dev` |
| `gke-gcloud-auth-plugin.exe not found` (kubectl) | Plugin missing / not on PATH | `gcloud components install gke-gcloud-auth-plugin` + PATH |
| `use of closed network connection` during push | Transient network drop (big image) | Just re-run `skaffold run` — already-pushed layers are skipped |
| `ImagePullBackOff` / 403 on pods | Node SA can't read the registry | Run the Step 5 IAM binding |
| `ErrImagePull` / "can't be pulled" (local Docker Desktop) | imagePullPolicy `Always` pulls a never-pushed image | set `imagePullPolicy: IfNotPresent` on the deployment |
| `NatsError: ECONNREFUSED ...:4222` then restart | NATS not ready at startup (race) | Harmless — pod restarts and recovers; deploy with `--status-check=false` |

## Handy commands
```powershell
kubectl get pods                                  # status of all pods
kubectl logs deploy/payments-depl                 # logs for a service
kubectl describe pod <pod-name>                    # why a pod is stuck
kubectl get ingress                                # the public IP
skaffold run --tail --status-check=false           # deploy and stream logs
gcloud container clusters list                     # is the cluster up?
```
