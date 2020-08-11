'''
Created on ٢٩‏/٠٥‏/٢٠١٠

@Created by: Muhammad Altabba
'''
from Cliticless import*

class UnderivedCliticless(Cliticless):
    """
     # PyUML: Do not remove this line! # XMI_ID:_qyiSo435Ed-gg8GOK1TmhA
    """
    '''
    Underived Word
    '''    
    

    def __init__(self, unvoweled, voweled):
        '''
        Constructor
        '''
        super().__init__()
        self.UnvoweledForm = unvoweled;
        self.VoweledForm = voweled;
        
