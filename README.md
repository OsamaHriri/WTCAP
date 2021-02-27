

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/OsamaHriri/WTCAP/tree/master/server/">
    <img src="https://github.com/OsamaHriri/WTCAP/blob/master/server/term_labeling/static/term_labeling/img/_logo.jpg?raw=true" alt="Logo" width="300" height="300">
  </a>

  <h3 align="center">Best-README-Template</h3>

  <p align="center">
    An awesome README template to jumpstart your projects!
    <br />
    <a href="https://github.com/OsamaHriri/WTCAP"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/OsamaHriri/WTCAP">View Demo</a>
    ·
    <a href="https://github.com/OsamaHriri/WTCAP/issues">Report Bug</a>
    ·
    <a href="https://github.com/OsamaHriri/WTCAP/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Main Tag Page][product-screenshot]]( )

[![Tags Handler][product-screenshot2]]( )


Word Tagging for Classical Arabic Poetry - WTCAP - is a system that aims to help identifying metaphors in classical Arabic poetry by automatically tagging words in a poem and using a hierarchy of tags to identify attachments that are suspected of metaphor.
The purpose of Word Tagging for Classical Arabic Poetry is to aid researchers in tagging poem terms and arriving to new insights based on those tags. The system is based on a graph database where one can manage the tags in addition to a document database for the poems.We will have a Linux server where the server side will run.

WTCAP was built as a final project in Information Systems Bsc for the three developers, it currently suggests tags for terms the system encountered before and allows the user to tag them and add his own tags.




A list of commonly used resources that I find helpful are listed in the acknowledgements.

### Built With

* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)
* [Django](https://www.djangoproject.com/)




<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
Machine - in order to fully run the features of the server side you need a linux machine since some libraries only work there (e.g. web scraping...) if you want to run the server on a windows machine use the master branch and not the deployment one - it will have less features.


- Install mongoDB 
   ```sh
   sudo apt-get install -y mongodb-org
   ```
- Install Neo4j
   ```sh
   sudo apt-get install neo4j=1:4.2.3
   ```
- Install Python 
- Install Python Packages 
  ```sh
  pip install -r requirements.txt
  
   ```






### Installation


1. Clone the repo
   ```sh
   git clone https://github.com/OsamaHriri/WTCAP
   ```









<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request






<!-- CONTACT -->
## Contact

https://github.com/OsamaHriri/WTCAP

Project Link: [https://github.com/OsamaHriri/WTCAP](https://github.com/OsamaHriri/WTCAP)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Pages](https://pages.github.com)
* [Loaders.css](https://connoratherton.com/loaders)
* [Slick Carousel](https://kenwheeler.github.io/slick)
* [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
* [Sticky Kit](http://leafo.net/sticky-kit)
* [JVectorMap](http://jvectormap.com)
* [Font Awesome](https://fontawesome.com)


https://github.com/OsamaHriri/WTCAP


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/OsamaHriri/WTCAP.svg?style=for-the-badge
[contributors-url]: https://github.com/OsamaHriri/WTCAP/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/OsamaHriri/WTCAP.svg?style=for-the-badge
[forks-url]: https://github.com/OsamaHriri/WTCAP/network/members
[stars-shield]: https://img.shields.io/github/stars/OsamaHriri/WTCAP.svg?style=for-the-badge
[stars-url]: https://github.com/OsamaHriri/WTCAP/stargazers
[issues-shield]: https://img.shields.io/github/issues/OsamaHriri/WTCAP.svg?style=for-the-badge
[issues-url]: https://github.com/OsamaHriri/WTCAP/issues
[license-shield]: https://img.shields.io/github/license/OsamaHriri/WTCAP.svg?style=for-the-badge
[license-url]: https://github.com/OsamaHriri/WTCAP/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/osama-hariri-54376215b/
[product-screenshot]: imges/Capture.PNG
[product-screenshot2]: imges/Capture3.PNG
