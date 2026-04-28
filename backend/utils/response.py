from flask import jsonify


def ok(data=None, message="success", msg=None):
    # 兼容历史调用：ok(msg="xxx")
    if msg is not None:
        message = msg
    return jsonify({"code": 200, "message": message, "data": data if data is not None else {}})


def fail(message="error", code=400):
    return jsonify({"code": code, "message": message, "data": {}}), code
