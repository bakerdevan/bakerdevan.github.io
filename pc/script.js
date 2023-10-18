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
            // Create a jsreport instance
            const jsreport = require('jsreport')();

            // Fetch the template file using Axios
            const templateResponse = await axios.get('https://bakerdevan.github.io/pc/test.docx', {
                responseType: 'arraybuffer'
            });

            // Create a base64-encoded data URI from the template data
            const templateDataUri = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(templateResponse.data))}`;

            // Configure the report
            jsreport.init().then(async () => {
                const result = await jsreport.render({
                    template: {
                        content: {
                            // Add your template content here if needed
                        },
                        engine: 'none', // No additional processing required
                        recipe: 'docx',
                        docxtemplater: {
                            templateAsset: {
                                content: templateDataUri,
                                name: 'template.docx',
                                shortid: 'template'
                            }
                        }
                    },
                    data: {
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
                    }
                });

                // Trigger download of the generated DOCX file
                const downloadLink = document.createElement('a');
                downloadLink.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${result.content.toString('base64')}`;
                downloadLink.download = 'generated.docx';
                downloadLink.click();
            }).catch(error => {
                console.error('An error occurred:', error);
                // Handle errors here
            });
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle errors here, e.g., display an error message to the user.
        }
    });
});
