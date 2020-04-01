<?php
class Term
{
    /* Member variables */
    var $place; /* sader/3ajez */
    var $line;
    var $index; /*place in line */
    var $value;

    /* getters and setters */
    function setPlace($par)
    {
        $this->place = $par;
    }

    function getPlace()
    {
        echo $this->place . "<br/>";
    }

    function setLine($par)
    {
        $this->line = $par;
    }

    function getIndex()
    {
        echo $this->index . " <br/>";
    }

    function setIndex($par)
    {
        $this->index = $par;
    }

    function getValue()
    {
        echo $this->value . " <br/>";
    }

    function setValue($par)
    {
        $this->value = $par;
    }

    /* Member functions */
    function getDefinition($par)
    {
    }
}
