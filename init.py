import websocket
import json
import threading
import os

class BinanceUS:
    def on_message(self, ws, message):
        data = json.loads(message)
        print("BINANCE:", data['data']['c'])
        # print('BTC price:', data['c'])

    def on_error(self, ws, error):
        print(error)

    def on_close(self, ws, close_status, close_reason):
        print('WebSocket connection closed')

    def on_open(self, ws):
        print('WebSocket connection established')
        #Getting price from Binance US using WebSockets
        ws.send(json.dumps({'method': 'SUBSCRIBE', 'params': ['btcusd@ticker'], 'id': 1}))

    def run(self):
        ws = websocket.WebSocketApp('wss://stream.binance.us:9443/stream', on_message=self.on_message, on_error=self.on_error, on_close=self.on_close)
        ws.on_open = self.on_open
        ws.run_forever()

class Coinbase:
    def on_message(self, ws, message):
        data = json.loads(message)
        if 'price' in data and data['type'] == 'ticker':
            print('COINBASE:', data['price'])

    def on_error(self, ws, error):
        print(error)

    def on_close(self, ws, close_status, close_reason):
        print('WebSocket connection closed')

    def on_open(self, ws):
        print('WebSocket connection established')
        ws.send(json.dumps({
            'type': 'subscribe',
            'product_ids': ['BTC-USD'],
            'channels': ['ticker']
        }))

    def run(self):
        ws = websocket.WebSocketApp('wss://ws-feed.pro.coinbase.com', on_message=self.on_message, on_error=self.on_error, on_close=self.on_close)
        ws.on_open = self.on_open
        ws.run_forever(ping_interval=10)
class GateIO:
    def on_message(self,ws, message):
        data = json.loads(message)
        if data['result']:
            print('GATEIO:', data['result']['last'])

    def on_error(self,ws, error):
        print(error)

    def on_close(self,ws, close_status, close_reason):
        print('WebSocket connection closed')

    def on_open(self, ws):
        print('WebSocket connection established')
        # Subscribe to the ticker channel for BTC/USDT pair
        ws.send(json.dumps({
            "channel": "spot.tickers",
            "event": "subscribe",  # "unsubscribe" for unsubscription
            "payload": ["BTC_USDT"]
        }))

    def run(self):
        ws = websocket.WebSocketApp('wss://api.gateio.ws/ws/v4/', os.environ.get("GATE_IO_API_KEY"), os.environ.get("GATE_IO_SECRET_KEY"), on_message=self.on_message, on_error=self.on_error, on_close=self.on_close)
        ws.on_open = self.on_open
        ws.run_forever()

if __name__ == '__main__':
    binance = BinanceUS()
    coinbase = Coinbase()
    gateio = GateIO()
    threads = [
        threading.Thread(target=binance.run),
        threading.Thread(target=coinbase.run),
        threading.Thread(target=gateio.run)
    ]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
