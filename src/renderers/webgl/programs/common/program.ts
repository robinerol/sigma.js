/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 */
import { loadVertexShader, loadFragmentShader, loadProgram } from "../../shaders/utils";

export interface RenderParams {
  width: number;
  height: number;
  ratio: number;
  matrix: Float32Array;
  scalingRatio: number;
}

export interface IProgram {
  bindBuffer(): void;
  bufferData(): void;
  allocate(capacity: number): void;
  bind(): void;
  render(params: RenderParams): void;
}

/**
 * Abstract Program class.
 *
 * @constructor
 */
export abstract class AbstractProgram implements IProgram {
  points: number;
  attributes: number;
  gl: WebGLRenderingContext;
  array: Float32Array = new Float32Array();
  buffer: WebGLBuffer;
  vertexShaderSource: string;
  vertexShader: WebGLShader;
  fragmentShaderSource: string;
  fragmentShader: WebGLShader;
  program: WebGLProgram;

  constructor(
    gl: WebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    points: number,
    attributes: number,
  ) {
    this.points = points;
    this.attributes = attributes;
    this.gl = gl;
    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
    const buffer = gl.createBuffer();
    if (buffer === null)
      throw new Error("sigma/renderers/webgl/program/program.Program: error while creating the buffer");
    this.buffer = buffer;
    this.bindBuffer();

    this.vertexShader = loadVertexShader(gl, this.vertexShaderSource);
    this.fragmentShader = loadFragmentShader(gl, this.fragmentShaderSource);
    this.program = loadProgram(gl, [this.vertexShader, this.fragmentShader]);
  }

  bindBuffer(): void {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
  }

  bufferData(): void {
    const gl = this.gl;
    gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
  }

  allocate(capacity: number): void {
    this.array = new Float32Array(this.points * this.attributes * capacity);
  }

  abstract bind(): void;
  abstract render(params: RenderParams): void;
}
