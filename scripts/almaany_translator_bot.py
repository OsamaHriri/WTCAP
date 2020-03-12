# coding=utf8
# Web Scrapper used for getteing Word Meaning in givien Websites, currently working woith ALmaany.com
from selenium import webdriver
from time import sleep
import sys

class ALmaanyBot():
    def __init__(self):
        self.driver = webdriver.Chrome()


    def search(self,word):
        self.driver.get('https://www.almaany.com/')
        searchBar = self.driver.find_element_by_xpath('//*[@id="search-word"]')
        searchBar.send_keys(word)
        searchButton=self.driver.find_element_by_xpath('//*[@id="main-search"]/div/div/button').click()

def main(argv):
    bot = ALmaanyBot()
    bot.search(argv)

    html_list  = bot.driver.find_element_by_xpath('//*[@id="page-content"]/div[1]/div[1]/div')
    items = html_list.find_elements_by_tag_name("li")
    print(items[1].text)
    for item in items:
        text = item.text
        print(text)

        with open('outfile'+argv+'.txt', 'a') as outfile:
            outfile.write(text)


if __name__ == "__main__":
   main(sys.argv[1])
