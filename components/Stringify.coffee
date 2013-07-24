noflo = require "noflo"
crypto = require "crypto-js"

class Stringify extends noflo.Component
  constructor: ->
    @encoding = "Utf8"

    @inPorts =
      in: new noflo.Port
      # 'Hex', 'Latin1', or 'Utf8'
      encoding: new noflo.Port
    @outPorts =
      out: new noflo.Port

    @inPorts.encoding.on "data", (@encoding) =>

    @inPorts.in.on "begingroup", (group) =>
      @outPorts.out.beginGroup group
    @inPorts.in.on "endgroup", =>
      @outPorts.out.endGroup()

    @inPorts.in.on "data", (data) =>
      @outPorts.out.send crypto.enc[@encoding].stringify data

    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new Stringify
