import sys
sys.path.append('NLP_toolkit')


from mongodbConnector import Connector
from NLP_toolkit import pre_tag
c = Connector()

poem = (c.get_poem(2065))
d = pre_tag.Pos_tagging()
str=''
i = 0
for row in poem[0]['context']:

    # str+= (row['sadr']+'\t' + row['ajuz']+'\n')
    # y = d.tag(row['sadr'])
    # print(y['Text']['Sentence']['Word'][0])
    str += (row['sadr'] + '\t' + row['ajuz'] + '\n')

# for s in str.split(' '):
#     if(s!=''):
#         print(s)
#y


y = (d.tag(str))

#
# y=d.tag('كَأَنَّ رِجالَ الأَوسِ تَحتَ لَبانِهِ   وَما جَمَعَت جَلٌّ مَعاً وَعَتيبُ')
#
# import os
# java_path = "C:\\Program Files (x86)\\Java\\jdk1.8.0_112\\bin\\java.exe"
# os.environ['JAVAHOME'] = java_path

# from nltk.tag.stanford import StanfordPOSTagger as POS_Tag
#
# arabic_postagger = POS_Tag('stanford-postagger-full-2014-08-27/models/arabic.tagger', 'stanford-postagger-full-2014-08-27/stanford-postagger.jar')
# sentence = 'أسامه'
# print(arabic_postagger.tag(sentence.split()))