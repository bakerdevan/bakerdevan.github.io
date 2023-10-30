document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("userForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form submission

        // Collect user input, including the "facts" section
        const todayDate = formatDate(document.getElementById("TODAYDATE").value);
        const rank = document.getElementById("RANK").value;
        const ofcName = document.getElementById("OFCNAME").value;
        const dsn = document.getElementById("DSN").value;
        const reportNum = document.getElementById("REPORTNUM").value;
        const susName = document.getElementById("SUSNAME").value;
        const ethnicity = document.getElementById("ETHNICITY").value;
        const gender = document.getElementById("GENDER").value;
        const dob = formatDate(document.getElementById("DOB").value);
        const susAddress = document.getElementById("SUSADDRESS").value;
        const susCityState = document.getElementById("SUSCITYSTATE").value;
        const offenseTimeDay = document.getElementById("OFFENSETIMEDAY").value;
        const crime = document.getElementById("CRIME").value;
        const chargeCode = document.getElementById("CHARGECODE").value;

        // Process the "facts" input to handle line breaks
        const facts = document.getElementById("FACTS").value;
        const paragraphs = facts.split(/\n\n+/).filter(paragraph => paragraph.trim() !== '').map(paragraph => ({ FACTS: paragraph }));

        try {
            // Fetch the template file using Axios
            const templateResponse = await axios.get('https://bakerdevan.github.io/pc/test2.docx', {
                responseType: 'arraybuffer'
            });

            // Create a new Blob with the template content
            const templateData = new Blob([templateResponse.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

            // Initialize the PizZip instance
            const zip = new PizZip(templateResponse.data);

            // Load the template content with paragraphLoop option
            const doc = new window.docxtemplater().loadZip(new PizZip(templateResponse.data), { paragraphLoop: true });

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
                FACTS: paragraphs,
            };

            // Replace placeholders in the document
            doc.setData(data);
            doc.render();

            // Generate the updated DOCX file as a Blob
            const updatedBlob = doc.getZip().generate({ type: "blob" });

            // Create a download link for the updated DOCX
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(updatedBlob);
            downloadLink.download = 'generated.docx';

            // Trigger the download
            downloadLink.click();
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle errors here, e.g., display an error message to the user.
        }
    });
    function formatDate(date) {
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`;
    }   
});
