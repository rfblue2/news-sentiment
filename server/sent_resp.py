from json import dumps

class SentimentElement:
    def __init__(self, url, cmts = None, json_obj = None):

        self._url = url
        
        if not json_obj is None:
            self._sent = json_obj["polarities"]
            self._lowest = json_obj["most_negative"]
            self._highest = json_obj["most_positive"]
        else:
            self._sent = []
            lowest_cmt, lowest_val = None, None
            highest_cmt, highest_val = None, None
            for (k1, k2), v in cmts.items():
                self._sent.append(v)
                if highest_val is None or v > highest_val:
                    highest_cmt, highest_val = (k1, k2), v
                if lowest_val is None or v < lowest_val:
                    lowest_cmt, lowest_val = (k1, k2), v  
            if not highest_cmt is None:
                self._highest = {"url": highest_cmt[0], "text": highest_cmt[1]}
            if not lowest_cmt is None:
                self._lowest = {"url": lowest_cmt[0], "text": lowest_cmt[1]}
                            
    @property
    def json_obj(self):
        root = {}
        root["most_positive"] = self._highest
        root["most_negative"] = self._lowest
        root["polarities"] = self._sent

        return root

    @property
    def url(self):
        return self._url

    @property
    def mongodb_entry(self):
        return {
            "url": self._url,
            "json_obj": self.json_obj
        }

def parse_mongodb_entry(entry):
    return SentimentElement(entry["url"], json_obj = entry["json_obj"])

class SentimentResponse:
    def __init__(self, elems):
        self._list = {}

        for url, elem in elems.items():
            self._list[url] = elem.json_obj

    @property
    def json_str(self):
        return dumps(self._list)
