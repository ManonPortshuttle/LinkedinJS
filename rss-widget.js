async function loadRSS(url, containerId) {
    try {
        const response = await fetch(url);

        // Controleer of de request succesvol was (status 200)
        if (!response.ok) {
            throw new Error(`HTTP-fout: ${response.status} ${response.statusText}`);
        }

        console.log("RSS-feed succesvol opgehaald.");
        
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");

         // Controleer of het XML-document geldig is
        const errorNode = xml.querySelector("parsererror");
        if (errorNode) {
            throw new Error("Fout bij het parseren van de XML.");
        }

        let items = xml.querySelectorAll("item");
        let html = "<div style='font-family: Arial; padding:10px; background:#fff; border-radius:10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>";

        items.forEach(item => {
            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;
            let description = item.querySelector("description").textContent;
            const pubDate = item.querySelector("pubDate")?.textContent || "Geen datum";

          // Verwijder <img> tags uit de beschrijving
            description = description.replace(/<img[^>]+>/gi, "");

            let imageUrl = "";
            const mediaContent = item.getElementsByTagName("media:content")[0];
            if (mediaContent) {
                imageUrl = mediaContent.getAttribute("url");
            }

            let imageHtml = "";
            if (imageUrl) {
                imageHtml = `<img src="${imageUrl}" style="max-width: 250px; height: auto; display: block; margin: 10px 0;">`;
            }

            html += `
                <div style="margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #ddd;">
                    <h3 style="margin:0;"><a href="${link}" target="_blank" style="color:#0077b5;">${title}</a></h3>
                    ${imageHtml} <!-- Afbeelding uit media:content tag -->
                    <p>${description}</p>
                    <small>🗓 ${new Date(pubDate).toLocaleDateString("nl-NL")}</small>
                </div>
            `;
        });

        html += "</div>";
        document.getElementById(containerId).innerHTML = html;
    } catch (error) {
        // Toon gedetailleerdere foutmelding in de console
        console.error("Fout bij laden van de RSS-feed:", error.message);
        document.getElementById(containerId).innerHTML = `Fout bij laden van RSS-feed: ${error.message}`;
    }
}

// Haal de RSS-feed op en vernieuw elke 5 minuten
loadRSS("https://raw.githubusercontent.com/ManonPortshuttle/LinkedinRSS/refs/heads/main/docs/PSRRSS.xml", "rss-widget-container");
setInterval(() => loadRSS("https://raw.githubusercontent.com/ManonPortshuttle/LinkedinRSS/refs/heads/main/docs/PSRRSS.xml", "rss-widget-container"), 100000);
