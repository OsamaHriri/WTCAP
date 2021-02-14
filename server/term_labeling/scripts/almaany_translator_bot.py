from selenium import webdriver
from time import sleep , time
import sys, getopt
import urllib.parse

class ALmaanyBot():
    def __init__(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')

        self.driver = webdriver.Chrome('/usr/bin/chromedriver',chrome_options=chrome_options)
        # self.driver = webdriver.Chrome()


    def search(self,word):

        word = urllib.parse.quote(word)
        query = 'https://www.almaany.com/ar/dict/ar-ar/' + word
        self.driver.get(query)
        self.driver.find_element_by_class_name('morelink').click()
        html_list  = self.driver.find_element_by_class_name('allcontent')
        return html_list.get_attribute('innerHTML') , query
         
        
    
    
    def search_doha(self,word):


        url = 'https://dohadictionary.org/dictionary/' + word
        self.driver.get(url)
        sleep(4)
        search = self.driver.find_element_by_class_name('tab-main-content')
        return search.get_attribute('innerHTML') , url 


# def main(argv):
#     tick = time()
#     bot = ALmaanyBot()
#     tack = time()
#     print(tack-tick)
#     tick = time()
    
#     # print(bot.search('اسد'))
    
#     print( bot.serch_doha('اسد'))


if __name__ == "__main__":
    tick = time()
    bot = ALmaanyBot()
    tack = time()
    print(tack-tick)
    tick = time()
    
    # print(bot.search('اسد'))
    
    print( bot.search_doha('اسد'))