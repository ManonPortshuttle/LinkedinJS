async function loadRSS(url, containerId) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");

        const items = xml.querySelectorAll("item");
        let html = "<div style='font-family: Arial; padding:10px; background:#fff; border-radius:10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>";

        items.forEach(item => {
            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;
            const description = item.querySelector("description").textContent;
            const pubDate = item.querySelector("pubDate")?.textContent || "Geen datum";


            
       // ✅ Verwijder <img> tags (inclusief volledige HTML-tags) uit de beschrijving
            description = description.replace(/<img[^>]+>/gi, ""); 

            // ✅ OPHALEN VAN <media:content> (voorkom dubbele afbeeldingen)
            let imageUrl = "";
            const mediaContent = item.getElementsByTagName("media:content")[0];
            if (mediaContent) {
                imageUrl = mediaContent.getAttribute("url");
            }

            // ✅ Voeg afbeelding alleen toe als er geen <img> tag in de beschrijving zit
            let imageHtml = "";
            if (imageUrl) {
                imageHtml = `<img src="${imageUrl}" style="max-width: 250px; height: auto; display: block; margin: 10px 0;">`;
            }

            html += `
                <div style="margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #ddd;">
                    <h3 style="margin:0;"><a href="${link}" target="_blank" style="color:#0077b5;">${title}</a></h3>
                    ${imageUrl ? `<img src="${imageUrl}" style="max-width: 120px; height: auto; display: block; margin: 10px 0;">` : ""}
                    <p>${description}</p>
                    <small>🗓 ${new Date(pubDate).toLocaleDateString("nl-NL")}</small>
                </div>
            `;
        });

        html += "</div>";
        document.getElementById(containerId).innerHTML = html;
    } catch (error) {
        document.getElementById(containerId).innerHTML = "Fout bij laden van RSS-feed.";
        console.error("Fout bij laden RSS:", error);
    }

   
}

// Haal de RSS-feed op en vernieuw elke 5 minuten
loadRSS("https://raw.githubusercontent.com/ManonPortshuttle/LinkedinRSS/refs/heads/main/docs/PSRRSS.xml", "rss-widget-container");
setInterval(() => loadRSS("https://raw.githubusercontent.com/ManonPortshuttle/LinkedinRSS/refs/heads/main/docs/PSRRSS.xml", "rss-widget-container"), 100000);
