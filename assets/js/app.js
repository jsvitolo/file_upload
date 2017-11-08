import 'phoenix_html';
import 'bootstrap';
import "blueimp-file-upload"
import $ from "jquery"

// on page load
$(() => {
    // find the form
    let $form = $('#file_upload');
    // evaluate the fileUpload plugin with a configuration
    // noinspection JSUnresolvedFunction
    $form.fileupload({
        // We auto upload once we get the response from the server
        autoUpload: true,
        // When you add a file this function is called
        add: (evt, data) => {
            // We only handle one file in this case, so let's just grab it
            let file = data.files[0];

            // Now we'll post to our API to get the signature
            $.ajax({
                url: "/api/upload_signatures",
                type: 'POST',
                dataType: 'json',
                // Pass in the data that our API expects
                data: { filename: file.name, mimetype: file.type },
                success: (response) => {
                    // after we hit the API, we'll get back the data we need to fill in form details.
                    // So let's do that...
                    $form.find('input[name=key]').val(response.key);
                    $form.find('input[name=AWSAccessKeyId]').val(response.AWSAccessKeyId);
                    $form.find('input[name=acl]').val(response.acl);
                    $form.find('input[name=success_action_status]').val(response.success_action_status);
                    $form.find('input[name=policy]').val(response.policy);
                    $form.find('input[name=signature]').val(response.signature);
                    $form.find('input[name=Content-Type]').val(response['Content-Type']);
                    // Now that we have everything, we can go ahead and submit the form for real.
                    data.submit()
                }
            })
        },
        send: (evt, data) => {
            console.log('imagine, if you will, a loading spinner')
        },
        fail: function(e, data) {
            console.log('now imagine that spinner stopped spinning.');
            console.log('...because you\'re a failure.');
            console.log(data)
        },
        done: function (event, data) {
            console.log('now imagine that spinner stopped spinning.');
            console.log("fin.")
        },
    })
})
