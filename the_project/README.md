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
kubectl apply -f manifests/deployment.yaml
```

4. Check logs
```
kubectl logs deployment/todo-app
```
