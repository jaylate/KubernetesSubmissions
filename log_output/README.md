# Log output

1. Build an image 
```
docker build -t log-output .
```

2. Import the image 
- With `k3d`
```
k3d image import log-output
```
- With `kind` (I use it)
```
kind load docker-image log-output
```

3. Create the deployment
```
kubectl apply -f manifests/deployment.yaml
```

4. Check logs
```
kubectl logs deployment/log-output
```
