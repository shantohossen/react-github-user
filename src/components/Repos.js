import React from "react";
import styled from "styled-components";
import { useGlobalContaxt } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = useGlobalContaxt();

  const mostUsed = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    if (!language) return total;

    if (!total[language]) {
      // creating a  new object key with dynamic object key and assing an object to it
      total[language] = { label: language, value: 1, star: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        star: total[language].star + stargazers_count,
      };
    }

    return total;
  }, {});

  let { star, forks } = repos.reduce(
    (obj, item) => {
      const { stargazers_count, forks, name } = item;
      obj.star[stargazers_count] = { label: name, value: stargazers_count };
      obj.forks[forks] = { label: name, value: forks };

      return obj;
    },
    { star: {}, forks: {} }
  );

  // most stars chart reduced data
  star = Object.values(star).slice(-5).reverse();
  // forks chart reduced data
  forks = Object.values(forks).slice(-5).reverse();

  // tool used chart
  const languages = Object.values(mostUsed)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  // star per language chart  using reduce method
  const starPerLang = Object.values(mostUsed)
    .sort((a, b) => {
      return b.star - a.star;
    })
    .reduce((arr, item) => {
      const newObj = { label: item.label, value: item.star };
      return [...arr, newObj];
    }, [])
    .slice(0, 5);

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={languages} />
        <Column3D data={star} />
        <Doughnut2D data={starPerLang} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
