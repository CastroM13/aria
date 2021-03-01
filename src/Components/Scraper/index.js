async function retornarNoticias() {
    var noticias; 
    await fetch('https://g1.globo.com/dynamo/natureza/rss2.xml').then((e) => {return noticias = e});
    return noticias; 
}
export default retornarNoticias;