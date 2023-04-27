import websocket
import json
import websockets
import asyncio
import threading
import os


dictionary = {
            "Binance":
              {
                "BTC": {
                    "Bid_Price": 0,
                    "Bid_Quantity": 0,
                    "Ask_Price": 0,
                    "Ask_Quantity": 0
                    }
                },
            "Coinbase":
              {
                "Bid_Price": 0,
                "Bid_Quantity": 0,
                "Ask_Price": 0,
                "Ask_Quantity": 0
                },
            "Gate":
              {
                "Bid_Price": 0,
                "Bid_Quantity": 0,
                "Ask_Price": 0,
                "Ask_Quantity": 0
                }
            }

# # define the on_message callback function
# def on_message(ws, message):
#     # parse the incoming message as a JSON object
#     # process the data as needed
#     # ...
#     # send a response back to the client
#     ws.send(json.dumps(dictionary))

# # create a WebSocket server on a specific port
# ws = websocket.WebSocketApp('localhost', 8000)

# # start the server
# ws.run_forever()

# class SendData:
#     def on_message(self, ws, message):
#         ws.send(json.dumps(dictionary))

#     def on_error(self, ws, error):
#         print(error)

#     def on_close(self, ws, close_status, close_reason):
#         print('WebSocket connection closed')

#     def on_open(self, ws):
#         print('WebSocket connection established')

#     def run(self):
#         ws = websocket.WebSocketApp('ws://localhost:8000/')
#         ws.on_open = self.on_open
#         ws.run_forever()
class BinanceUS:
    def on_message(self, ws, message):
       data = json.dumps({'method': 'SUBSCRIBE', 'params': ['btcusd@bookTicker'], 'id': 1})
       if 'b' and 'B' in data['data']:
        if dictionary['Binance']['BTC']['Bid_Price'] != data['data']['b']:
            dictionary['Binance']['BTC']['Bid_Price'] = data['data']['b']
            print(dictionary)
        if dictionary['Binance']['BTC']['Bid_Quantity'] != data['data']['B']:
            dictionary['Binance']['BTC']['Bid_Quantity'] = data['data']['B']

       if 'a' and 'A' in data['data']:
        if dictionary['Binance']['BTC']["Ask_Price"] != data['data']['a']:
            dictionary['Binance']['BTC']['Ask_Price'] = data['data']['a']
        if dictionary['Binance']['BTC']["Ask_Quantity"] != data['data']['A']:
            dictionary['Binance']['BTC']['Ask_Quantity'] = data['data']['A']
        # print("BINANCE Best Ask price: ", data['data']['a'])
        # print("BINANCE Best Ask quantity: ", data['data']['A'])

    def on_error(self, ws, error):
        print(error)

    def on_close(self, ws, close_status, close_reason):
        print('WebSocket connection closed')

    def on_open(self, ws):
        print('WebSocket connection established')
        #Getting price from Binance US using WebSockets
        data = json.dumps({'method': 'SUBSCRIBE', 'params': ['btcusd@bookTicker'], 'id': 1})
        # print("DATA IN ON_OPEN", data)
        ws.send(data)

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

async def send_dictionary(websocket, path):
    # convert dictionary to JSON string
    json_dict = json.dumps(dictionary)
    # send JSON string to the React app
    await websocket.send(json_dict)

async def main():
    async with websockets.serve(send_dictionary, "localhost", 8000):
        await asyncio.Future()


if __name__ == '__main__':
    binance = BinanceUS()
    # send_data = SendData()
    # coinbase = Coinbase()
    # gateio = GateIO()
    threads = [
        threading.Thread(target=binance.run),
        # threading.Thread(target=send_data.run)
        # threading.Thread(target=coinbase.run),
        # threading.Thread(target=gateio.run)
    ]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
