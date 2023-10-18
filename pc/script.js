document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("userForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form submission

        // Collect user input
        const todayDate = document.getElementById("TODAYDATE").value;
        const rank = document.getElementById("RANK").value;
        const ofcName = document.getElementById("OFCNAME").value;
        const dsn = document.getElementById("DSN").value;
        const reportNum = document.getElementById("REPORTNUM").value;
        const susName = document.getElementById("SUSNAME").value;
        const ethnicity = document.getElementById("ETHNICITY").value;
        const gender = document.getElementById("GENDER").value;
        const dob = document.getElementById("DOB").value;
        const susAddress = document.getElementById("SUSADDRESS").value;
        const susCityState = document.getElementById("SUSCITYSTATE").value;
        const offenseTimeDay = document.getElementById("OFFENSETIMEDAY").value;
        const crime = document.getElementById("CRIME").value;
        const chargeCode = document.getElementById("CHARGECODE").value;

        // Collect "facts" input correctly
        const factsTextarea = document.getElementById("FACTS");
        const facts = factsTextarea.value;

        try {
            // Fetch the template file using Axios
            const templateResponse = await axios.get('https://bakerdevan.github.io/pc/test.docx', {
                responseType: 'arraybuffer'
            });

            // Create a PizZip object with the template data
            const zip = new PizZip(templateResponse.data);

            // Create a Docxtemplater instance and load the zip
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

            // Set data in the template
            doc.setData(data);

            // Render the template
            doc.render();

            // Generate the updated DOCX file as a Blob
            const generatedBlob = doc.getZip().generate({ type: "blob" });

            // Create a download link for the updated DOCX
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
