# Web Scrapper used for getteing Word Meaning in givien Websites, currently working woith ALmaany.com
from selenium import webdriver
from time import sleep


class ALmaanyBot():
    def __init__(self):
        self.driver = webdriver.Chrome()


    def search(self,word):
        self.driver.get('https://www.almaany.com/')
        searchBar = self.driver.find_element_by_xpath('//*[@id="search-word"]')
        searchBar.send_keys(word)
        searchButton=self.driver.find_element_by_xpath('//*[@id="main-search"]/div/div/button').click()




bot = ALmaanyBot()
bot.search("اسد ")

html_list  = bot.driver.find_element_by_xpath('//*[@id="page-content"]/div[1]/div[1]/div/ol[2]')
items = html_list.find_elements_by_tag_name("li")
for item in items:
    text = item.text
    print (text)

