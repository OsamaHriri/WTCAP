import codecs
import io
import os

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

from TextEncapsulator import *

# Set Files Locations Variables:
'''
Change the next few parameters as appropriate.
'''

baseDirectory = ROOT_DIR
baseDirectoryOfQutufDB = os.path.join(baseDirectory, 'Data')
inputTextFile = os.path.join(baseDirectoryOfQutufDB, 'test_Qutuf.txt')
baseDirectoryOfAlKhalilDB = os.path.join(baseDirectory, 'AlKhalil_V1_Modified', 'db/')
# ouputXmlFile = os.path.join(baseDirectory,'Output','test.xml')
# ouputHtmlFile = os.path.join(baseDirectory,'Output','test.html')


# Set Operations Variables:
prematureTaggingPositiveThreshold = 1
prematureTaggingNegativeThreshold = -1

overdureTaggingThreshold = None
overdureTaggingTopReservants = None

'''
The next few parameters are fixed do not change them.
'''
procliticsXmlFile = os.path.join(baseDirectoryOfQutufDB, 'MorphologyTransducers', 'Proclitics.xml')
encliticsXmlFile = os.path.join(baseDirectoryOfQutufDB, 'MorphologyTransducers', 'Enclitics.xml')
prematureTaggingRulesXmlFile = os.path.join(baseDirectoryOfQutufDB, 'TaggingRepository', 'PrematureTaggingRules.xml')
overdueTaggingRulesXmlFile = os.path.join(baseDirectoryOfQutufDB, 'TaggingRepository', 'OverdueTaggingRules.xml')
rootsFolder = 'roots2'

# Initialize:
text = TextEncapsulator()

# Load Data from Files:
text.LoadFromFiles(baseDirectoryOfAlKhalilDB, rootsFolder,
                   procliticsXmlFile, encliticsXmlFile,
                   prematureTaggingRulesXmlFile,
                   overdueTaggingRulesXmlFile)


def runit(phrase, functionality='lema', outputFormat = 'html'):
    # Read input text into Qutuf:
    text.String = "أسدان"

    # Process:
    text.Tokenize()
    print("done")
    text.Normalize(2)
    print("done")
    text.CompoundParsing()
    print("done")
    text.PrematureTagging()
    print("done")
    text.ParseClitics()
    print("done")
    text.PatternMatching(prematureTaggingPositiveThreshold, prematureTaggingNegativeThreshold)
    print("done")
    text.OverdueTagging(overdureTaggingThreshold, overdureTaggingTopReservants)
    print("done")
    if functionality == 'lemma':
        text.exposeLemma()
    print("done")
    # Write Output:

    streamWriter = io.StringIO()
    if outputFormat == 'html':
        text.RenderHtml(streamWriter, functionality)
    else:
        text.RenderXml(streamWriter, functionality)
    output = streamWriter.getvalue()
    print("done")
    # Log to terminal:
    print('---------------------------------------------------------------------------')
    text.Print()
    print('---------------------------------------------------------------------------')

    # Log to file:
    writer = codecs.open('test.txt', 'w', 'utf-8')
    writer.write(output)
    writer.close()

    return output


print(runit(""))