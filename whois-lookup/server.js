const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());
function truncateHostname(hostname) {
  return hostname.length > 25 ? hostname.slice(0, 25) + "..." : hostname;
}

app.post("/whois", async (req, res) => {
  const { domainName, type } = req.body;

  if (!domainName || !type) {
    return res
      .status(400)
      .json({ error: "Please provide both domainName and type." });
  }

  try {
    const apiKey = process.env.apiKey;
    const response = await axios.get(
      `https://www.whoisxmlapi.com/whoisserver/WhoisService`,
      {
        params: {
          domainName,
          outputFormat: "JSON",
          apiKey,
        },
      }
    );

    const data = response.data.WhoisRecord;

    if (!data) {
      return res.status(404).json({ error: "No data found for this domain." });
    }

    if (type === "domain information") {
      const domainInfo = {
        domainName: data.domainName || "",
        registrarName: data.registrarName || "",
        registrationDate: data.createdDate || "",
        expirationDate: data.expiresDate || "",
        estimatedDomainAge: data.estimatedDomainAge || "",
        hostnames:
          data.nameServers?.hostNames?.map(truncateHostname).join(", ") || "",
      };
      res.json(domainInfo);
    } else if (type === "contact information") {
      const contactInfo = {
        registrantName: data.registrant?.name || "",
        technicalContactName: data.technicalContact?.name || "",
        administrativeContactName: data.administrativeContact?.name || "",
        contactEmail: data.contactEmail || "",
      };
      res.json(contactInfo);
    } else {
      res.status(400).json({ error: "Invalid type specified." });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "An error occurred while fetching the domain information.",
      });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
