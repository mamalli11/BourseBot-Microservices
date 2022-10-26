exports.appRes = (res, data, message = "Your request was successful", status = "success", code = 200) => {
    return res.status(code).json({
        code,
        status,
        message,
        data,
    })
}