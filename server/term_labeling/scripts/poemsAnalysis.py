from collections import Counter
from mongodbConnector import Connector
import pyarabic.araby as araby
from farasa.stemmer import FarasaStemmer
import json
import nltk
import re
import os
nltk.download('stopwords')
stemmer = FarasaStemmer(interactive=True)



class Research(object):
    def __init__(self):
        self.punctuation = ['!', '"', '#', '?', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';',
                       '<', '=', '>', '...', '.', '..''?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~']
        self.arabic_alpha = ['ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'ص', 'ض', 'ط', 'ظ', 'ع',
                        'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی'];
        self.arb_stopwords = nltk.corpus.stopwords.words("arabic")

    def extractInfo(self):
        c = Connector()
        result = c.get_poems_context()
        poetsNum = len(c.get_poets())
        poemsNum = len(result)
        all = ""
        for r in result:
                s = ""
                for j in r["context"]:
                    if 'sadr' in j:
                        s += stemmer.stem(araby.strip_tashkeel(j['sadr'])) + " "
                    if 'ajuz' in j:
                        s += stemmer.stem(araby.strip_tashkeel(j['ajuz'])) + " "
                all += s;
        word_tokens = re.findall(r"[\w']+", all)
        tokensNum = len(word_tokens)
        all_stops = self.arb_stopwords + self.punctuation + self.arabic_alpha
        filtered_sentence = [w for w in word_tokens if not w in all_stops]
        termswithoutStop=len(filtered_sentence)
        stopWordsNum= tokensNum - termswithoutStop
        Count = Counter(filtered_sentence)
        termsNum = len(Count)
        d = []
        for key, value in dict(Count.most_common()).items():
            d.append(dict(x=key, value=value,freq=(value/termsNum)))
        d2=[dict(poetsNum=poetsNum,tokensNum=tokensNum,poemsNum=poemsNum,termswithoutStop=termswithoutStop,stopWordsNum=stopWordsNum,termsNum=termsNum)]
        cur_path = os.path.dirname(__file__)
        new_path = os.path.relpath('../static/images/Analysis', cur_path)
        with open(os.path.join(new_path, "TermFreq.json"), "w") as outfile:
            json.dump(d, outfile)
        with open(os.path.join(new_path, "generalInfo.json"), "w") as outfile:
            json.dump(d2, outfile)


    def extractInfobyPeriod(self):
        c = Connector()
        d={}
        for p in c.get_periods():
            result = c.get_poems_by_period(p)
            all = ""
            for k in result:
                for r in k["results"]:
                    s = ""
                    for j in r["context"]:
                        if 'sadr' in j:
                            s += stemmer.stem(araby.strip_tashkeel(j['sadr'])) + " "
                        if 'ajuz' in j:
                            s += stemmer.stem(araby.strip_tashkeel(j['ajuz'])) + " "
                    all += s;
            word_tokens = re.findall(r"[\w']+", all)
            all_stops = self.arb_stopwords + self.punctuation + self.arabic_alpha
            filtered_sentence = [w for w in word_tokens if not w in all_stops]
            Count = Counter(filtered_sentence)
            d1 = []
            for key, value in dict(Count.most_common()).items():
                d1.append(dict(x=key, value=value , freq=(value/len(Count))))
            d[str(p)] = d1

        cur_path = os.path.dirname(__file__)
        new_path = os.path.relpath('../static/images/Analysis', cur_path)
        #filename = "$.json".replace("$", '11')
        with open(os.path.join(new_path, "TermFreqperPeriod.json"), "w") as outfile:
            json.dump(d, outfile)



if __name__ == "__main__":
    research = Research()
    research.extractInfo()
    research.extractInfobyPeriod()
