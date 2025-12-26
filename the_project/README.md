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

4. (Optional) Port forward (WARNING: the command will keep running in the terminal to keep forwarding)
```
kubectl port-forward deployment/todo-app 8080:8080
```
