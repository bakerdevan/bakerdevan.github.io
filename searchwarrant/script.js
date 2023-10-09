// script.js

document.getElementById("userForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Collect user input
    var userName = document.getElementById("name").value;
    var userEmail = document.getElementById("email").value;

    // Fetch the template file
    fetch('test.docx')
        .then(response => response.arrayBuffer())
        .then(templateContent => {
            // Create a new DOCXtemplater instance
            var doc = new window.docxtemplater();

            // Load the template content
            doc.loadZip(templateContent);

            // Data to fill the template
            var data = {
                NAME: userName,
                EMAIL: userEmail,
            };

            // Bind data to the template
            doc.setData(data);

            // Perform the template substitution
            doc.render();

            // Generate the DOCX file as a Blob
            var blob = doc.getZip().generate({ type: 'blob' });

            // Create a download link for the generated DOCX
            var downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'generated.docx';

            // Trigger the download
            downloadLink.click();
        })
        .catch(error => {
            console.error('Error fetching the template:', error);
        });
});
