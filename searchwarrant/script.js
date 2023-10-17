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
        const facts = document.getElementById("FACTS").value;

        // Input validation
        if (!validateInputs(todayDate, rank, ofcName, dsn, reportNum, susName, ethnicity, gender, dob, susAddress, susCityState, offenseTimeDay, crime, chargeCode, facts)) {
            return; // Don't proceed if validation fails
        }

        try {
            // Fetch the template file using Axios
            const templateResponse = await axios.get('test.docx', {
                responseType: 'arraybuffer'
            });

            // Create a new Blob with the template content
            const templateData = new Blob([templateResponse.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

            // Initialize the JSZip instance
            const zip = new JSZip();

            // Load the template content
            const doc = await zip.loadAsync(templateData);

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
                FACTS: facts,
            };

            // Replace placeholders in the document
            const content = await doc.file('word/document.xml').async("string");
            let updatedContent = content;
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const placeholder = `{{${key}}}`;
                    const regex = new RegExp(placeholder, 'g');
                    updatedContent = updatedContent.replace(regex, data[key]);
                }
            }
            doc.file('word/document.xml', updatedContent);

            // Generate the updated DOCX file as a Blob
            const updatedBlob = await doc.generateAsync({ type: "blob" });

            // Convert the facts to HTML using Mammoth
            const htmlFacts = await mammoth.convertToHtml(facts);
            
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

    // Input validation function
    function validateInputs(...inputs) {
        for (const input of inputs) {
            if (!input) {
                alert('Please fill out all required fields.');
                return false;
            }
        }
        return true;
    }
});
