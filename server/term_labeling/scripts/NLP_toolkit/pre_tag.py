import codecs
import io
import os
import xmltodict
from TextEncapsulator import *

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))


# Set Files Locations Variables:
'''
Change the next few parameters as appropriate.
'''


class Pos_tagging():

    def __init__(self):
        baseDirectory = ROOT_DIR
        baseDirectoryOfQutufDB = os.path.join(baseDirectory, 'Data')
        inputTextFile = os.path.join(baseDirectoryOfQutufDB, 'test_Qutuf.txt')
        baseDirectoryOfAlKhalilDB = os.path.join(baseDirectory, 'AlKhalil_V1_Modified', 'db/')
        # ouputXmlFile = os.path.join(baseDirectory,'Output','test.xml')
        # ouputHtmlFile = os.path.join(baseDirectory,'Output','test.html')

        # Set Operations Variables:
        self.prematureTaggingPositiveThreshold = 1
        self.prematureTaggingNegativeThreshold = -1

        self.overdureTaggingThreshold = None
        self.overdureTaggingTopReservants = None

        '''
        The next few parameters are fixed do not change them.
        '''
        procliticsXmlFile = os.path.join(baseDirectoryOfQutufDB, 'MorphologyTransducers', 'Proclitics.xml')
        encliticsXmlFile = os.path.join(baseDirectoryOfQutufDB, 'MorphologyTransducers', 'Enclitics.xml')
        prematureTaggingRulesXmlFile = os.path.join(baseDirectoryOfQutufDB, 'TaggingRepository',
                                                    'PrematureTaggingRules.xml')
        overdueTaggingRulesXmlFile = os.path.join(baseDirectoryOfQutufDB, 'TaggingRepository',
                                                  'OverdueTaggingRules.xml')
        rootsFolder = 'roots2'

        # Initialize:
        self.text = TextEncapsulator()

        # Load Data from Files:
        self.text.LoadFromFiles(baseDirectoryOfAlKhalilDB, rootsFolder,
                           procliticsXmlFile, encliticsXmlFile,
                           prematureTaggingRulesXmlFile,
                           overdueTaggingRulesXmlFile)


    def tag(self,phrase, functionality='lema', outputFormat='xml'):
        # Read input text into Qutuf:

        self.text.String = phrase

        # Process:
        self.text.Tokenize()
        self.text.Normalize(2)
        self.text.CompoundParsing()
        self.text.PrematureTagging()
        self.text.ParseClitics()
        self.text.PatternMatching(self.prematureTaggingPositiveThreshold, self.prematureTaggingNegativeThreshold)
        self.text.OverdueTagging(self.overdureTaggingThreshold, self.overdureTaggingTopReservants)
        if functionality == 'lemma':
            self.text.exposeLemma()
        print("done")
        # Write Output:

        streamWriter = io.StringIO()
        if outputFormat == 'html':
            self.text.RenderHtml(streamWriter, functionality)
        else:
            self.text.RenderXml(streamWriter, functionality)
        output = streamWriter.getvalue()
        # print(output)
        # Log to terminal:
        print('---------------------------------------------------------------------------')
        # text.Print()
        print('---------------------------------------------------------------------------')
        print(type(output))

        # Log to file:
        writer = codecs.open('test.txt', 'w', 'utf-8')
        writer.write(output)
        writer.close()
        dict = xmltodict.parse(output, encoding='utf-8')
        # print(dict['Text'])
        return dict

