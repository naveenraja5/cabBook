function get_validation_failure_response(errors, error_message = "Invalid Params", details) {
    let response = {}
    response.success = false
    response.status = "Bad Request"
    response.error_message = error_message

    if (details != null) {
        response.details = details
    }

    if (errors != null) {
        response.errors = errors
    }
    return response
}

function get_success_response(message, status, details) {
    if (status == null) {
        status = "Request processed Successfully"
    }
    let response = {}
    response.success = true
    response.status = status
    response.message = message
    if (details != null) {
        response.details = details
    }
    return response
}

module.exports = {get_validation_failure_response, get_success_response}