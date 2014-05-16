describe("Essential#start", function() {
  context("given an application and a behavior attached to a DOM element", function() {

    beforeEach(function() {
      setDocumentContents("test/fixtures/single_element.html");
      this.domElement = document.getElementById("carousel");
      this.app = {};
    });

    it("initializes a behavior with the proper name", function() {
      this.app.Carousel = customBehavior;
      Essential.start(this.app);
      this.domElement.dispatchEvent(Events.click());

      expect(Helper.flag).to.not.equal(0);
    });

    context("when a behavior is not defined", function() {

      beforeEach(function() {
        this.app = {};
      });

      it("does not initialize a behavior", function() {
        Essential.start(this.app);
        this.domElement.dispatchEvent(Events.click());

        expect(Helper.flag).to.not.equal(0);
      });

      it("does not raise an exception", function() {
        var self = this;

        expect(function() {
          Essential.start(self.app);
        }).to.not.
        throw();
      });
    });

    context("given two or more behaviors with different priorities", function() {

      beforeEach(function() {
        setDocumentContents("test/fixtures/different_priorities.html");
        this.App = {};

        window.callStack = [];

        var BaseBehavior = Essential.Behavior.extend({
          init: function() {
            callStack.push(this);
          }
        });

        this.App.FirstPriorityBehavior = BaseBehavior.extend({
          priority: 3
        });

        this.App.SecondPriorityBehavior = BaseBehavior.extend({
          priority: 1
        });
      });

      it("must execute the behaviors with more priority first even if it appears later on the dom", function() {
        Essential.start(this.App);

        expect(callStack[0].priority).to.be.eq(3);
        expect(callStack[1].priority).to.be.eq(1);
      });
    });
  });
});
