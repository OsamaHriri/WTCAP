

import Root
from CliticlessPOS import *


class VoweledPattern(object):

    ID = 0;

    VoweledForm = '';

    CanonicForm = '';

    POS = CliticlessPOS();

    def __init__(self, id=0, voweledForm='', canonicForm='', mainClass=0, gender=0, count=0, inflectionState=0):
        '''
        Constructor
        '''

        self.ID = id;
        self.VoweledForm = voweledForm;
        self.CanonicForm = canonicForm;
        self.MainClass = mainClass;
        self.Gender = gender;
        self.Count = count;
        self.InflectionState = inflectionState;

        self.POS = CliticlessPOS();
        pass

    def SetAttributeFromBinaryPOS(self, binaryPOS):
        self.BinaryPOS = binaryPOS;
        raise Exception('Not Implemented');
        pass
