describe('Hash', () => {
  let c = null;
  let algorithm = null;
  let encoding = null;
  let ins = null;
  let out = null;
  before(function (done) {
    this.timeout(4000);
    const loader = new noflo.ComponentLoader(baseDir);
    loader.load('crypto/Hash', (err, instance) => {
      if (err) {
        done(err);
        return;
      }
      c = instance;
      algorithm = noflo.internalSocket.createSocket();
      encoding = noflo.internalSocket.createSocket();
      ins = noflo.internalSocket.createSocket();
      c.inPorts.algorithm.attach(algorithm);
      c.inPorts.encoding.attach(encoding);
      c.inPorts.in.attach(ins);
      done();
    });
  });
  beforeEach(() => {
    out = noflo.internalSocket.createSocket();
    c.outPorts.out.attach(out);
  });
  afterEach(() => c.outPorts.out.detach(out));

  describe('md5', () => it('should generate md5', (done) => {
		let expected = [
			'5eb63bbbe01eeed093cb22bb8f5acdc3', 
			'e807f1fcf82d132f9bb018ca6738a19f'
		];
    out.on('data', (data) => {
			console.log(data)
      chai.expect(data).to.equal(expected.shift());
      if (!expected.length) {
        done();
      }
    });
    algorithm.send('md5');
    encoding.send('hex');
		ins.send('hello world');
    ins.send('1234567890');
	}));
  describe('sha256', () => it('should generate sha256', (done) => {
		let expected = [
			'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9', 
			'c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646'
		];
    out.on('data', (data) => {
			console.log(data)
      chai.expect(data).to.equal(expected.shift());
      if (!expected.length) {
        done();
      }
    });
    algorithm.send('sha256');
    encoding.send('hex');
		ins.send('hello world');
    ins.send('1234567890');
  }));
});