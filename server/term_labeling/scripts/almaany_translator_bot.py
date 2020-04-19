# coding=utf8
# Web Scrapper used for getting Word Meaning in given Websites, currently working with ALmaany.com
from selenium import webdriver


class ALmaanyBot:
    def __init__(self):
        self.driver = webdriver.Chrome()

    def search(self, word):
        self.driver.get('https://www.almaany.com/')
        searchBar = self.driver.find_element_by_xpath('//*[@id="search-word"]')
        searchBar.send_keys(word)
        searchButton = self.driver.find_element_by_xpath('//*[@id="main-search"]/div/div/button').click()
        r = []
        html_list = self.driver.find_element_by_xpath('//*[@id="page-content"]/div[1]/div[1]/div')
        items = html_list.find_elements_by_tag_name("li")
        print(items[1].text)
        for item in items:
            r.append(item.text)
            print(item.text)
        return r

# def main(argv):
#
#
# if __name__ == "__main__":
#    main(sys.argv[1])