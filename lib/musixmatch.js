const fetch = require('node-fetch');
const cheerio = require('cheerio');

const useragents = [
    'Mozilla/5.0 (Windows NT 5.1; rv:7.0.1) Gecko/20100101 Firefox/7.0.1', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:18.0) Gecko/20100101 Firefox/18.0','Mozilla/5.0 (X11; U; Linux Core i7-4980HQ; de; rv:32.0; compatible; JobboerseBot; http://www.jobboerse.com/bot.htm) Gecko/20100101 Firefox/38.0','Mozilla/5.0 (Windows NT 5.1; rv:36.0) Gecko/20100101 Firefox/36.0','Mozilla/5.0 (Windows NT 5.1; rv:33.0) Gecko/20100101 Firefox/33.0','Mozilla/5.0 (Windows NT 10.0; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0','Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:43.0) Gecko/20100101 Firefox/43.0','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0','Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.12) Gecko/20050915 Firefox/1.0.7','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0','Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0','Mozilla/5.0 (Windows NT 6.0; rv:34.0) Gecko/20100101 Firefox/34.0','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0','Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0','Mozilla/5.0 (Windows NT 5.1; rv:40.0) Gecko/20100101 Firefox/40.0','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:42.0) Gecko/20100101 Firefox/42.0','Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.5) Gecko/20041107 Firefox/1.0','Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0','Mozilla/5.0 (Windows NT 6.1; rv:17.0) Gecko/20100101 Firefox/20.6.14','Mozilla/5.0 (Windows NT 5.1; rv:30.0) Gecko/20100101 Firefox/30.0','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0','Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/29.0','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0','Mozilla/5.0 (Windows NT 6.1; rv:52.0) Gecko/20100101 Firefox/52.0','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:59.0) Gecko/20100101 Firefox/59.0','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:41.0) Gecko/20100101 Firefox/41.0','Mozilla/5.0 (X11; U; Linux Core i7-4980HQ; de; rv:32.0; compatible; JobboerseBot; https://www.jobboerse.com/bot.htm) Gecko/20100101 Firefox/38.0','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.10) Gecko/20050716 Firefox/1.0.6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0',
]

const getURL = query => {
    return new Promise((resolve, reject) => {
        fetch(`https://www.musixmatch.com/search/${encodeURI(query)}/tracks`, 
            { headers: { 'User-Agent': useragents[Math.floor(Math.random() * useragents.length)] }}
        ).then(r => r.text())
        .then(body => {
            const $ = cheerio.load(body);
            const bestMatchURL = $('li[class="showArtist showCoverart"] a').attr('href')
                    ? $('li[class="showArtist showCoverart"] a').attr('href').valueOf()
                    : reject(new Error('No song found!'));
            return bestMatchURL ? resolve(`https://musixmatch.com${bestMatchURL}`) : bestMatchURL;
        });
    });
}

const getLyrics = url => {
    return new Promise((resolve, reject) => {
        fetch(url, 
            { headers: { 'User-Agent': useragents[Math.floor(Math.random() * useragents.length)] }}
        ).then(r => r.text())
        .then(body => {
            const $ = cheerio.load(body);
            //$('div[class=" col-sm-10 col-md-8 col-ml-6 col-lg-6"] div').first().remove();
            $('div[class="lyrics-to hidden-xs hidden-sm"]').remove();
            $('div[class="mxm-lyrics"] div[class=""]').remove();
            $('div[class="translation-list-box"]').remove();
            $('div[class="mxm-lyrics"] div div[class="row"] div').first().remove();
            $('div[class="lyrics-to hidden-xs hidden-sm"]').remove();
            
            $('div[class="review-changes  review-changes__warning"]').remove();
            $('div[class="review-changes  review-changes__error"]').remove();
            $('div[class="review-changes-box"]').remove();
            
            $('span span[class="lyrics__content__ok"]').append('\n');
            
            if($('h2[class="mxm-empty__title"]').text() === 'Restricted Lyrics') {
                return reject(new Error('Lyrics are restricted (nothing can be done).'));
            }
            
            const potential = $('div[class="mxm-lyrics"] span p').text().trim();
            const potential2 = $('div[class="mxm-track-lyrics-container"] div[class="mxm-lyrics"] span').first().text();
            
            // console.log(potential.length, potential2.length)
            if(potential && potential.length >= potential2.length && potential.length > 0) {
                return resolve(potential);
            } else if(potential2 && potential2.length > potential.length && potential2.length > 0) {
                return resolve(potential2);
            } else {
                return reject(new Error('I couldn\'t fetch the lyrics! Open a support ticket on the repo.'));
            }
        })
    });
}

module.exports = { 
    getURL, 
    getLyrics 
};
