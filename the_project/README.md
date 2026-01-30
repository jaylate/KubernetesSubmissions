# Todo App

1. Build an image 
```
docker build -t todo-app .
docker build -t todo-backend todo-backend
docker build -t todo-job todo-job
```

2. Import the image 
- With `k3d`
```
k3d image import todo-app todo-backend todo-job
```
- With `kind` (I use it)
```
kind load docker-image todo-app todo-backend todo-job
```

3. Create the deployment and stateful set for database (with Kustomize)
```
sops --decrypt todo-backend/manifests/secret.enc.yaml > todo-backend/manifests/secret.yaml
kubectl apply -k .
```

4. Check logs
```
kubectl logs -n project deployment/todo-app
```

5. Get Ingress IP and the app will be accessible on that IP
```
kubectl get -n project ingress todo-app-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

## Lessons learned
- Do not hard code `localhost` in app code as listening address (`0.0.0.0` is better, but maybe not the best for security reasons)
  - I spent several hours debugging my kind and service configs to only then find that the app will not accept any requests done from outside of the container because I left `localhost` in the code, even though `kubectl port-forward` worked.
