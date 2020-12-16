#!/usr/bin/env python
# coding: utf-8

# In[1]:


import mongodbConnector as cc
c = cc.Connector()


# In[2]:


from  pyarabic.araby import strip_harakat


# In[3]:


f = c.get_all_poems()


# In[4]:


len(f)


# In[5]:


poems_dir = 'poems/*.txt'


# In[6]:


import glob   


# In[18]:


files=glob.glob(poems_dir)  


# In[19]:


docs =[]
for file in files:     
    f=open(file, 'r')  
    poem = f.read().rstrip("\n")
    docs.append(poem)

    


# In[20]:


from sklearn.feature_extraction.text import CountVectorizer
import re


# In[21]:


with open('list.txt','r') as f:
    sw = f.readlines()


# In[22]:


sf = [s.rstrip('\n') for s in sw]


# In[23]:


stopwords =sf


# In[24]:





# In[45]:


len(stopwords)


# In[26]:


cv=CountVectorizer(max_df=0.85,stop_words=stopwords)
word_count_vector=cv.fit_transform(docs)


# In[27]:



word_count_vector.shape


# In[28]:


cv=CountVectorizer(max_df=0.85,stop_words=stopwords,max_features=10000)
word_count_vector=cv.fit_transform(docs)
word_count_vector.shape


# In[29]:



list(cv.vocabulary_.keys())[:10]


# In[30]:


list(cv.get_feature_names())[2000:2015]


# In[31]:



from sklearn.feature_extraction.text import TfidfTransformer

tfidf_transformer=TfidfTransformer(smooth_idf=True,use_idf=True)
tfidf_transformer.fit(word_count_vector)


# In[32]:


tfidf_transformer.idf_


# In[33]:



def sort_coo(coo_matrix):
    tuples = zip(coo_matrix.col, coo_matrix.data)
    return sorted(tuples, key=lambda x: (x[1], x[0]), reverse=True)

def extract_topn_from_vector(feature_names, sorted_items, topn=10):
    """get the feature names and tf-idf score of top n items"""
    
    #use only topn items from vector
    sorted_items = sorted_items[:topn]

    score_vals = []
    feature_vals = []

    for idx, score in sorted_items:
        fname = feature_names[idx]
        
        #keep track of feature name and its corresponding score
        score_vals.append(round(score, 3))
        feature_vals.append(feature_names[idx])

    #create a tuples of feature,score
    #results = zip(feature_vals,score_vals)
    results= {}
    for idx in range(len(feature_vals)):
        results[feature_vals[idx]]=score_vals[idx]
    
    return results


# In[34]:


feature_names=cv.get_feature_names()


# In[35]:


doc=docs[123]


# In[36]:


tf_idf_vector=tfidf_transformer.transform(cv.transform([doc]))


# In[37]:


sorted_items=sort_coo(tf_idf_vector.tocoo())


# In[38]:


keywords=extract_topn_from_vector(feature_names,sorted_items,10)


# In[39]:


for k in keywords:
    print(k,keywords[k])


# In[40]:


def get_keywords(poem):

    #generate tf-idf for the given document
    tf_idf_vector=tfidf_transformer.transform(cv.transform([poem]))

    #sort the tf-idf vectors by descending order of scores
    sorted_items=sort_coo(tf_idf_vector.tocoo())

    #extract only the top n; n here is 10
    keywords=extract_topn_from_vector(feature_names,sorted_items,5)
    
    return [k for k in keywords]


# In[41]:


def print_results(idx,keywords):
    for k in keywords:
        print(k,keywords[k])


# In[50]:


idx=12354
keywords=get_keywords(docs[idx])
keywords


# In[ ]:





# In[ ]:





# In[55]:


for document in c.poemsCollections.find():
    poem = strip_harakat(' '.join([' '.join(list(x.values())[1::]) for x in  document['context']]))
    keywords = get_keywords(poem)
    c.poemsCollections.update({"_id":document['_id']},{"$set": {"keywords": keywords}})

    


# In[ ]:





# In[ ]:




