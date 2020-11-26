from arabic_reshaper import reshape      # pip install arabic-reshaper
from bidi.algorithm import get_display   # pip install python-bidi
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
from collections import Counter
from django.contrib.staticfiles import finders
import nltk
import re
nltk.download('stopwords')



class cloud(object):

    def createCloud(self, all):
        word_tokens = re.findall(r"[\w']+", all)
        arb_stopwords = nltk.corpus.stopwords.words("arabic")
        punctuation = ['!', '"', '#','?','$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>','...','.','..''?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~']
        all_stops = arb_stopwords + punctuation
        filtered_sentence = [w for w in word_tokens if not w in all_stops]
        Count = Counter(filtered_sentence)
        rtl = lambda w: get_display(reshape(f'{w}'))
        counts = {rtl(k): v for k, v in Count.most_common(50)}
        result = finders.find('images/NotoNaskhArabic-Regular.ttf')
        wc = WordCloud(font_path = result,width=800, height=400,max_words=50,
                       background_color="white").generate_from_frequencies(counts)
        return wc