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


def main(argv):
    tick = time()
    bot = ALmaanyBot()
    tack = time()
    print(tack-tick)
    tick = time()
    bot.search(argv[0])
    more_button = html_list  = bot.driver.find_element_by_class_name('morelink')
    more_button.click()

    html_list  = bot.driver.find_element_by_class_name('allcontent')

    text = html_list.get_attribute('innerHTML')
    print(text)
        # print('-'*50)
    tack = time()

    print(tack-tick)


if __name__ == "__main__":
   main(sys.argv[1:])