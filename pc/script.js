document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("userForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form submission

        // Collect user input (same as before)

        try {
            const PizZip = require('pizzip');
            const Docxtemplater = require('docxtemplater');
            
            // Fetch the template file using Axios
            const templateResponse = await axios.get('https://bakerdevan.github.io/pc/test.docx', {
                responseType: 'arraybuffer'
            });
            
            const zip = new PizZip(templateResponse.data);
            const doc = new Docxtemplater().loadZip(zip);

            // Data to fill the template
            const data = {
                TODAYDATE: todayDate,
                RANK: rank,
                OFCNAME: ofcName,
                DSN: dsn,
                REPORTNUM: reportNum,
                SUSNAME: susName,
                ETHNICITY: ethnicity,
                GENDER: gender,
                DOB: dob,
                SUSADDRESS: susAddress,
                SUSCITYSTATE: susCityState,
                OFFENSETIMEDAY: offenseTimeDay,
                CRIME: crime,
                CHARGECODE: chargeCode,
                FACTS: facts, // Add the facts field
            };

            doc.setData(data);

            doc.render();

            const generatedBlob = doc.getZip().generate({ type: "blob" });

            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(generatedBlob);
            downloadLink.download = 'generated.docx';

            // Trigger the download
            downloadLink.click();
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle errors here, e.g., display an error message to the user.
        }
    });
});
