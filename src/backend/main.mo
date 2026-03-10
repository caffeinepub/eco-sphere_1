actor {
  public query ({ caller }) func greet(name : Text) : async Text {
    "Welcome to Eco Sphere, " # name # "!";
  };
};
