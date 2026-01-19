# Log output

1. Build the images
```
docker build -t log-output .
docker build -t log-reader log-reader
docker build -t ping-pong ping-pong-app
```

2. Import the image 
- With `k3d`
```
k3d image import log-output
k3d image import log-reader
k3d image import ping-pong
```
- With `kind` (I use it)
```
kind load docker-image log-output
kind load docker-image log-reader
kind load docker-image ping-pong
```
  - NOTE: To enable Ingress in `kind` it is required to run `cloud-provider-kind` during the exercise runtime. Although port-forwarding from the node's port `80` to `localhost` didn't work, the Ingress IP was accessible.

3. Create the deployment
```
kubectl apply -f manifests/ -f ping-pong-app/manifests/
```

4. Check logs
```
kubectl logs -n exercises deployment/log-output log-reader
```

5. Get Ingress IP and the endpoint will be accessible on that IP (On '/' - log-output, on '/pingpong' - ping-pong-app)
```
kubectl get -n exercises ingress log-output-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```
