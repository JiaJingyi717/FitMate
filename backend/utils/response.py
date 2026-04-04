from flask import jsonify


def ok(data=None, msg="success"):
    return jsonify({"code": 0, "msg": msg, "data": data if data is not None else {}})


def fail(msg="error", code=400):
    return jsonify({"code": code, "msg": msg, "data": {}}), code
