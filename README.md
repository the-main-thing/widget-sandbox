1. Install packages:
```sh
npm i
   ```
2. Build sdk  
```sh
cd sdk && npm run build && cd ..
```
3. Run SDK server
```sh
cd sdk-delivery-server && npm run start
```
4. In a new terminal start widget server
```sh
cd widget && npm run dev
```
5. In a new terminal start test server (host for widget):
```sh
cd test-server && npm run dev
```
