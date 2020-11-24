from arabic_reshaper import reshape      # pip install arabic-reshaper
from bidi.algorithm import get_display   # pip install python-bidi
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
from collections import Counter
from django.contrib.staticfiles import finders

class cloud(object):

    def createCloud(self, all):
        Count = Counter(all.split())
        rtl = lambda w: get_display(reshape(f'{w}'))
        counts = {rtl(k): v for k, v in Count.most_common(50)}
        #font_file = finders.find('NotoNaskhArabic-Regular.ttf')
        wc = WordCloud(font_path = 'arial', max_font_size=50, stopwords=STOPWORDS ,max_words=50,
                       background_color="white").generate_from_frequencies(counts)
        return wc