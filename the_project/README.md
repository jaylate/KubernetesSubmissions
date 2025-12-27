# Todo App

1. Build an image 
```
docker build -t todo-app .
```

2. Import the image 
- With `k3d`
```
k3d image import todo-app
```
- With `kind` (I use it)
```
kind load docker-image todo-app
```

3. Create the deployment
```
kubectl apply -f manifests
```

4. Check logs
```
kubectl logs deployment/todo-app
```

5. Get Ingress IP and the app will be accessible on that IP
```
kubectl get ingress todo-app-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

## Lessons learned
- Do not hard code `localhost` in app code as listening address (`0.0.0.0` is better, but maybe not the best for security reasons)
  - I spent several hours debugging my kind and service configs to only then find that the app will not accept any requests done from outside of the container because I left `localhost` in the code, even though `kubectl port-forward` worked.
