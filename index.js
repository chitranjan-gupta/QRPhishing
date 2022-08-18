const http = require('http');
const {Builder, until, By} = require('selenium-webdriver');
const host = "localhost";
const port = 8200;
let src = "";
async function Browser(){
	try{
		const driver = await new Builder().forBrowser('chrome').build();
		const url = "https://messages.google.com/web/authentication";
		const newurl = "https://messages.google.com/web/conversations";
		const cdpConnection = await driver.createCDPConnection('page');
		await driver.logMutationEvents(cdpConnection, event => {
			if(event['attribute_name'] === "src"){
				src = event['current_value'];
			}
		});
		await driver.get(url);
		await driver.wait(until.elementLocated(By.className('qr-code')),15000);
		const cu = await driver.getCurrentUrl();
		if(cu === newurl){
			process.exit(0);
		}
	}catch(e){
		console.log(e);
	}
}
const requestListener = async function(req,res){
	res.setHeader("Content-Type","text/html");
	res.writeHead(200);
	res.end(`<!DOCTYPE html>
				<html>
					<head>
						<title></title>
					</head>
					<body>
						<img alt="" src=${src} />
						<script type="text/javascript">
							window.setInterval(() => {
								window.location.reload(true)
							},3000);
						</script>
					</body>
				</html>`);
};
const server = http.createServer(requestListener);
server.listen(port,host,()=>{
	console.log('Server is Listening on localhost:8200');
});
Browser().then(() => {
	console.log('Fetching QRCODE');
}).catch(err => {
	console.log(err);
});