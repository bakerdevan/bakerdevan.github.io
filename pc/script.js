document.addEventListener("DOMContentLoaded", async function () {
    // Constants for DOM elements
    const form = document.getElementById("userForm");
    const chargesContainer = document.getElementById("chargesContainer");
    const addedCharges = document.getElementById("addedCharges");
    const input = document.getElementById("CRIME");
    const chargeCodeInput = document.getElementById("CHARGECODE");
    const datalist = document.getElementById("crimeautofill");

    // Arrays to store data
    const csvData = [];
    const charges = [];
    const dynamicCharges = [];

    // Event listener for the "Add Charges" button
    addChargesBtn.addEventListener("click", function () {
        // Get the values from the crime and charge code inputs
        const crimeValue = input.value.trim();
        const chargeCodeValue = chargeCodeInput.value.trim();

        // Check if both crime and charge code have values
        if (crimeValue && chargeCodeValue) {
            // Create a new HTML element to display the added charge
            const addedChargeDiv = document.createElement("div");
            addedChargeDiv.textContent = `${crimeValue} - RSMO ${chargeCodeValue}`;

            // Create a remove button
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.style.marginLeft = "10px";
            removeButton.addEventListener("click", function () {
                // Remove the charge from the charges array
                const index = dynamicCharges.findIndex(c => c.CRIME === crimeValue && c.CHARGECODE === chargeCodeValue);
                if (index !== -1) {
                    dynamicCharges.splice(index, 1);
                }

                // Remove the corresponding div from addedCharges
                addedCharges.removeChild(addedChargeDiv);
            });
            addedChargeDiv.appendChild(removeButton);

            // Append the new charge element to the addedCharges section
            addedCharges.appendChild(addedChargeDiv);

            // Update the dynamicCharges array
            const newCharge = { CRIME: crimeValue, CHARGECODE: chargeCodeValue };
            dynamicCharges.push(newCharge);

            // Clear the input fields
            input.value = "";
            chargeCodeInput.value = "";
        } else {
            // Handle the case where either crime or charge code is empty
            console.error("Both Crime and Charge Code are required.");
        }
    });

    // Fetch and parse the CSV data
    try {
        const results = await axios.get('https://bakerdevan.github.io/pc/ChargeCodeCSV2023-8-13-PCGenerator.csv');
        const csvParsingOptions = {
            header: true,
            dynamicTyping: true,
        };
        const parseResults = Papa.parse(results.data, csvParsingOptions);

        if (parseResults.errors.length > 0) {
            console.error("CSV parsing errors:", parseResults.errors);
        } else if (parseResults.data.length > 0) {
            csvData.push(...parseResults.data);

            // Event listener for crime input
            input.addEventListener("input", function () {
                const value = this.value.toUpperCase();
                const matches = csvData.filter(row => row["LongDescription"].toUpperCase().includes(value));
                datalist.innerHTML = "";
                matches.forEach(match => {
                    const option = document.createElement("option");
                    option.value = match["LongDescription"];
                    datalist.appendChild(option);
                });
            });

            // Event listener for crime selection
            input.addEventListener("change", function () {
                const selectedCrime = this.value;
                const matchingRow = csvData.find(row => row["LongDescription"] === selectedCrime);
                if (matchingRow) {
                    let chargeCode = matchingRow["ChargeCode"];
                    const specialPhrase = "99.0";
                    chargeCodeInput.value = chargeCode + specialPhrase;
                } else {
                    chargeCodeInput.value = "";
                }
            });
        } else {
            console.error("No data found in the CSV file.");
        }
    } catch (error) {
        console.error("Error fetching CSV:", error.message);
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form submission

        // Collect statically defined charges from the chargesContainer
        const staticChargesInputs = chargesContainer.querySelectorAll('.charges');
        const staticCharges = Array.from(staticChargesInputs).map(chargesInput => {
            const crime = chargesInput.querySelector("#CRIME").value;
            const chargeCode = chargesInput.querySelector("#CHARGECODE").value;
            return { CRIME: crime, CHARGECODE: chargeCode };
        });

        // Collect dynamically added charges from the addedCharges section
        const dynamicChargesDivs = addedCharges.querySelectorAll('div');
        const dynamicCharges = Array.from(dynamicChargesDivs).map(div => {
            const chargeInfo = div.textContent.replace('Remove','').trim();
            const [crime, chargeCode] = chargeInfo.split(' - RSMO ');
            return { CRIME: crime.trim(), CHARGECODE: chargeCode.trim() };
        });

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
                FACTS: paragraphs,
                CHARGES: charges.concat(dynamicCharges).map(charge => ({ CHARGE: `${charge.CRIME} - RSMO ${charge.CHARGECODE}`.trim() })),
            };

            // Replace placeholders in the document
            doc.setData(data);
            doc.render();

            // Generate the updated DOCX file as a Blob
            const updatedBlob = doc.getZip().generate({ type: "blob" });

            // Create a download link for the updated DOCX
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(updatedBlob);
            downloadLink.download = `${document.getElementById("REPORTNUM").value} PC STATEMENT.docx`;

            // Trigger the download
            downloadLink.click();
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle errors here, e.g., display an error message to the user.
        }
        console.log(charges.map(charge => `${charge.CRIME} - RSMO ${charge.CHARGECODE}`));

    });
    // Function to format date
    function formatDate(date) {
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`;
    }
});