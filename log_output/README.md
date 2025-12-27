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
  - NOTE: To enable Ingress in `kind` it is required to run `cloud-provider-kind` during the exercise runtime. Although port-forwarding from the node's port `80` to `localhost` didn't work, the Ingress IP was accessible.

3. Create the deployment
```
kubectl apply -f manifests/
```

4. Check logs
```
kubectl logs deployment/log-output
```

5. Get Ingress IP and the endpoint will be accessible on that IP
```
kubectl get ingress log-output-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```
