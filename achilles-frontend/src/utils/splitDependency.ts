const splitDependency = (dependency: string) => {
  const dep = dependency.split('@');

  let depName = dep[0];
  let depVersion = dep[1];

  if (dep.length > 2) {
    const tempDep = dep;
    depName = tempDep.splice(0, tempDep.length - 1).join('@');
    depVersion = tempDep[0];
  }

  return { depName, depVersion };
};

export default splitDependency;
